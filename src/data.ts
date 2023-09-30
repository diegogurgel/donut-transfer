
export const donutGraphData = {
  nodes: [
    {
      id: 'UNIT1',
      label: 'Unit A',
      series: [
        { id: 'STATUS2', count: 0, name: 'Approved' },
        { id: 'STATUS1', count: 989, name: 'Started' },
        { id: 'STATUS3', count: 0, name: 'Canceled' },
      ],
    },
    {
      id: 'UNIT2',
      label: 'Unit B',
      series: [
        { id: 'STATUS2', count: 832, name: 'Approved' },
        { id: 'STATUS1', count: 100, name: 'Started' },
        { id: 'STATUS4', count: 360, name: 'Pending' },
      ],
    },
    {
      id: 'UNIT3',
      label: 'Unit C',
      series: [
        { id: 'STATUS2', count: 789, name: 'Approved' },
        { id: 'STATUS1', count: 200, name: 'Started' },
        { id: 'STATUS5', count: 80, name: 'Rejected' },
      ],
    },
    {
      id: 'UNIT4',
      label: 'Unit D',
      series: [
        { id: 'STATUS2', count: 689, name: 'Approved' },
        { id: 'STATUS4', count: 250, name: 'Pending' },
        { id: 'STATUS5', count: 80, name: 'Rejected' },
      ],
    },
    {
      id: 'UNIT5',
      label: 'Unit E',
      series: [
        { id: 'STATUS2', count: 589, name: 'Approved' },
        { id: 'STATUS4', count: 300, name: 'Pending' },
        { id: 'STATUS5', count: 80, name: 'Rejected' },
      ],
    },
    {
      id: 'UNIT6',
      label: 'Unit F',
      series: [
        { id: 'STATUS2', count: 500, name: 'Approved' },
        { id: 'STATUS4', count: 100, name: 'Pending' },
        { id: 'STATUS5', count: 200, name: 'Rejected' },
      ],
    },
    {
      id: 'UNIT6',
      label: 'Unit G',
      series: [
        { id: 'STATUS2', count: 389, name: 'Approved' },
        { id: 'STATUS4', count: 120, name: 'Pending' },
        { id: 'STATUS5', count: 500, name: 'Rejected' },
      ],
    },
    {
      id: 'UNIT6',
      label: 'Unit G',
      series: [
        { id: 'STATUS2', count: 300, name: 'Approved' },
        { id: 'STATUS4', count: 100, name: 'Pending' },
        { id: 'STATUS5', count: 20, name: 'Rejected' },
      ],
    },
  ],
  edges: [
    { source: 'UNIT1', target: 'UNIT2' },
    { source: 'UNIT1', target: 'UNIT3' },
    { source: 'UNIT1', target: 'UNIT4' },
    { source: 'UNIT4', target: 'UNIT5' },
    { source: 'UNIT3', target: 'UNIT5' },
    { source: 'UNIT2', target: 'UNIT3' },
    { source: 'UNIT5', target: 'UNIT6' },
  ]
};