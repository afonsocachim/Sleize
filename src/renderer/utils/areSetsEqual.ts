export const areSetsEqual = (a: Set<unknown>, b: Set<unknown>) =>
  a.size === b.size && [...a].every((value) => b.has(value));
