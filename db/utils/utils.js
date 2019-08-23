exports.formatDates = list => {
  if (!list.length) return [];
  return list.map(obj => ({ ...obj, created_at: new Date(obj.created_at) }));
};

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};
