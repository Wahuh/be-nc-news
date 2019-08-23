exports.formatDates = list => {
  if (!list.length) return [];
  return list.map(obj => ({ ...obj, created_at: new Date(obj.created_at) }));
};

exports.makeRefObj = list => {
  return list.reduce((acc, curr) => {
    const { title, article_id } = curr;
    acc[title] = article_id;
    return acc;
  }, {});
};

exports.formatComments = (comments, articleRef) => {
  if (!comments.length) return [];
  return comments.map(comment => {
    const { created_by, belongs_to, created_at, ...rest } = comment;
    return {
      ...rest,
      author: created_by,
      article_id: articleRef[belongs_to],
      created_at: new Date(created_at)
    };
  });
};
