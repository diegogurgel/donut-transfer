

const ellipsis = (text: string, maxLength: number) =>
  text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

export default ellipsis;

export const generateStringId = (text: string): string =>
  `${(text || Math.random().toString()).trim()}_${Math.floor(Math.random() * Date.now())}`;
