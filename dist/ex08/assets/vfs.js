export function createVfs(tree) {
  const items = new Map();
  for (const item of tree.items) {
    items.set(item.id, { ...item });
  }

  function getItem(id) {
    return items.get(id) || null;
  }

  function getChildren(parentId) {
    return Array.from(items.values()).filter(i => i.parentId === parentId);
  }

  function findByName(name, kind = null) {
    return Array.from(items.values()).find(i => i.name === name && (!kind || i.kind === kind));
  }

  function getPath(id) {
    const path = [];
    let current = items.get(id);
    while (current && current.parentId) {
      path.unshift(current.name);
      current = items.get(current.parentId);
    }
    return path;
  }

  function createFolder(parentId, name) {
    const id = "f" + Math.random().toString(36).slice(2, 8);
    items.set(id, {
      id,
      kind: "folder",
      name,
      parentId,
      modified: new Date().toISOString().slice(0, 10),
      size: "—"
    });
    return id;
  }

  function renameItem(id, newName) {
    const item = items.get(id);
    if (!item) return false;
    item.name = newName;
    item.modified = new Date().toISOString().slice(0, 10);
    return true;
  }

  function moveItem(id, targetFolderId) {
    const item = items.get(id);
    if (!item) return false;
    item.parentId = targetFolderId;
    item.modified = new Date().toISOString().slice(0, 10);
    return true;
  }

  function deleteItem(id) {
    const item = items.get(id);
    if (!item) return false;
    const children = getChildren(id);
    for (const child of children) {
      deleteItem(child.id);
    }
    items.delete(id);
    return true;
  }

  return {
    rootId: tree.rootId,
    items,
    getItem,
    getChildren,
    findByName,
    getPath,
    createFolder,
    renameItem,
    moveItem,
    deleteItem
  };
}
