export const removeDashes = function (uuid: string) {
  if (uuid) {
    uuid = uuid.replace(/-/g, "");
  }

  return uuid;
};
