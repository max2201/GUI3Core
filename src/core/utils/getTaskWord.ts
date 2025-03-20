export const getTaskWord = (number: number, taskArray: Array<string>): string => {
  const taskForms = [...taskArray]
  let form: number

  if (number % 10 === 1 && number % 100 !== 11) {
    form = 0
  } else if (number % 10 >= 2 && number % 10 <= 4 && !(number % 100 >= 12 && number % 100 <= 14)) {
    form = 1
  } else {
    form = 2
  }

  return `${number} ${taskForms[form]}`
}
