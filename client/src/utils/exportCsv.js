export const exportToCSV = (transactions, filename = 'spendly_transactions.csv') => {
  if (!transactions || !transactions.length) return;

  const headers = ['Date', 'Type', 'Description', 'Category', 'Amount', 'Payment Method', 'Notes'];
  
  const rows = transactions.map(t => [
    new Date(t.date).toLocaleDateString('en-IN'),
    t.type,
    `"${(t.description || '').replace(/"/g, '""')}"`,
    t.category,
    t.amount,
    t.paymentMethod || 'Cash',
    `"${(t.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(e => e.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToCsv = exportToCSV;

