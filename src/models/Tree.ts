/**
 * file tree
 */
export default interface Tree {
  id: string;
  name: string;
  parent?: Tree;
  children?: Tree[];
}
