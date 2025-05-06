export enum WidgetTypes {
  // Значение и значение с детализацией
  NumberValue = 10,
  // График пирог/пицца
  PieChart = 20,
  // График пончик/бублик
  DonutChart = 30,
  // График столбцы
  ColumnChart = 40,
  // График линии
  LineChart = 50,
  // Таблица
  TableView = 60,
}

export const typesMap = {
  10: { name: 'numbers', icon: 'charts-numbers', title: 'Значение' },
  20: { name: 'pie', icon: 'charts-pie', title: 'График пирог' },
  30: { name: 'donut', icon: 'charts-donut', title: 'График пончик' },
  40: { name: 'bar', icon: 'charts-bars', title: 'График столбцы' },
  50: { name: 'area', icon: 'charts-line', title: 'График линии' },
  60: { name: 'table', icon: 'charts-table', title: 'Таблица' },
}

export enum WidgetEditEventTypes {
  Delete = 1,
  Update = 2,
}
