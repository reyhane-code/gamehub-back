
export const toSlug = (str: string) => {
  return str.toLowerCase().replace(/\s+/g, '-');
};

export const expandHandler = (expand: string, model: any) => {
  const associations = expand.split(',');
  return associations.map((item) => ({
    model: model.associations[`${item}`].target,
  }));
};


