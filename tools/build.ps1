$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
$exercisesDir = Join-Path $root "exercises"
$distDir = Join-Path $root "dist"
$srcDir = Join-Path $root "src"
$templateDir = Join-Path $root "scorm_template"

if (!(Test-Path $distDir)) { New-Item -ItemType Directory -Path $distDir | Out-Null }

$launchTemplate = Get-Content -Raw (Join-Path $templateDir "launch.html.template")
$manifestTemplate = Get-Content -Raw (Join-Path $templateDir "imsmanifest.xml.template")

$exerciseFiles = Get-ChildItem $exercisesDir -Filter "ex*.json"

foreach ($file in $exerciseFiles) {
  $exId = [IO.Path]::GetFileNameWithoutExtension($file.Name)
  $config = Get-Content -Raw $file.FullName | ConvertFrom-Json

  $outDir = Join-Path $distDir $exId
  $assetsDir = Join-Path $outDir "assets"
  $outExercisesDir = Join-Path $outDir "exercises"

  if (Test-Path $outDir) { Remove-Item -Recurse -Force $outDir }
  New-Item -ItemType Directory -Path $outDir, $assetsDir, $outExercisesDir | Out-Null

  Copy-Item -Recurse -Force $srcDir\* $assetsDir
  Copy-Item -Recurse -Force $exercisesDir\* $outExercisesDir

  $title = if ($config.title) { $config.title } else { $exId }
  $launchHtml = $launchTemplate.Replace("{{EXERCISE_ID}}", $exId).Replace("{{TITLE}}", $title)
  $manifest = $manifestTemplate.Replace("{{EXERCISE_ID}}", $exId).Replace("{{TITLE}}", $title)

  Set-Content -Encoding UTF8 -Path (Join-Path $outDir "index.html") -Value $launchHtml
  Set-Content -Encoding UTF8 -Path (Join-Path $outDir "imsmanifest.xml") -Value $manifest

  $zipPath = Join-Path $distDir ("$exId.zip")
  if (Test-Path $zipPath) { Remove-Item -Force $zipPath }

  Compress-Archive -Path (Join-Path $outDir "*") -DestinationPath $zipPath
  Write-Host "Built $exId.zip"
}
