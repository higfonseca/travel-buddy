type IDataMock<T> = {
  [P in keyof T]?: IDataMock<T[P]>
}

const dataMock = <T>(instance: IDataMock<T> = {}): T => {
  return instance as any
}

export { dataMock }
