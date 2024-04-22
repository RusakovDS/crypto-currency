function generateId(pre: string): string {
  return pre + '__' + new Date().getTime();
}

export default generateId;
