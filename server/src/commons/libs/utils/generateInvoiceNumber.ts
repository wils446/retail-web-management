type InvoiceType = 'transaction' | 'order' | 'return';

const typeCode: Record<InvoiceType, string> = {
  order: 'ORD',
  transaction: 'TRN',
  return: 'RTN',
};

export const generateInvoiceNumber = (type: InvoiceType, count: number) => {
  const number = '' + (count + 1);
  const pad = '000';

  const lastNumber = pad.substring(0, pad.length - number.length) + number;
  const date = new Date().toISOString().substring(0, 10).replaceAll('-', '');

  return `SB-${typeCode[type]}-${date}-${lastNumber}`;
};
