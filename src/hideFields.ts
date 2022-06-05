import Config from './config';

export default function hideFields(object: Record<string, any>, censorWith = 'xxx') {
  const keysToHide = Config.HIDDEN_FIELDS;
  if (keysToHide.length == 0) {
    console.log('RETURN!');
    return;
  }
  Object.keys(object).forEach((key) => {
    if (keysToHide.includes(key)) {
      object[key] = censorWith;
    }
    if (typeof object[key] === 'object') {
      hideFields(object[key], censorWith);
    }
  });
}
