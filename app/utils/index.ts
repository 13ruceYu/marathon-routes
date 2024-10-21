export function splitEvery(arr: any[], n: number) {
  if (n <= 0) {
    throw new Error('First argument to splitEvery must be a positive integer')
  }
  const res = []
  for (let i = 0; i < arr.length; i += n) {
    res.push(arr.slice(i, i + n))
  }
  return res
}
