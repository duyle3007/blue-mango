export const setProp =
  (key: string, value: unknown) =>
  (query: Record<string, unknown> = {}) => {
    if (value) {
      return {
        ...query,
        [key]: value,
      };
    }

    return query;
  };

export const queryBuilder = (
  setPropFns: Array<
    (query: Record<string, unknown>) => Record<string, unknown>
  >,
  initalValue: Record<string, unknown> = {}
) => {
  return setPropFns.reduce((query, fn) => fn(query), initalValue);
};
