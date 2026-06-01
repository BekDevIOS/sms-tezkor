const VARIABLE_PATTERN = /{{\s*(name|phone)\s*}}/gi;

export function hasNameVariable(message: string): boolean {
  return /{{\s*name\s*}}/i.test(message);
}

export function findUnsupportedVariables(message: string): string[] {
  const variables = [...message.matchAll(/{{\s*([^{}]+?)\s*}}/g)].map((match) => match[1].toLowerCase());
  return [...new Set(variables.filter((variable) => !['name', 'phone'].includes(variable)))];
}

export function renderMessageTemplate(
  message: string,
  contact: { name?: string; phone: string },
): string {
  return message.replace(VARIABLE_PATTERN, (_match, variable: string) => {
    if (variable.toLowerCase() === 'name') return contact.name?.trim() ?? '';
    return contact.phone;
  });
}
