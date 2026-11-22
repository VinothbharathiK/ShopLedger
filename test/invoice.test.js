'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const invoice = require('../lib/invoice');
const pricing = require('../lib/pricing');

function item(name, sku, hsn, gstRate, price, qty) {
  return { name, sku, hsn, gstRate, price, qty };
}

function assertInvoiceFigures(order, expectedInvoice, expectedCheckout) {
  const invoiceFigures = invoice.computeInvoiceFigures(order);
  const checkoutFigures = pricing.computeTotals(order.items, order.coupon);

  assert.deepStrictEqual(invoiceFigures, expectedInvoice);
  assert.deepStrictEqual({
    subtotal: checkoutFigures.subtotal,
    discount: checkoutFigures.discount,
    tax: checkoutFigures.tax,
    cgst: checkoutFigures.cgst,
    sgst: checkoutFigures.sgst,
    total: checkoutFigures.total
  }, expectedCheckout);
}

test('#1001 invoice matches checkout with 5% and 12% items and no coupon', function () {
  const order = {
    id: 1001,
    coupon: '',
    items: [
      item('Rice', 'GRN-001', '1006', 5, 140, 2),
      item('Ghee', 'DRY-001', '0405', 12, 165, 2)
    ]
  };

  assertInvoiceFigures(order, {
    subtotal: 610,
    discount: 0,
    tax: 53.6,
    cgst: 26.8,
    sgst: 26.8,
    total: 663.6,
    rows: [
      { name: 'Rice', sku: 'GRN-001', hsn: '1006', qty: 2, price: 140, gstPercent: 5, line: 280, lineTax: 14 },
      { name: 'Ghee', sku: 'DRY-001', hsn: '0405', qty: 2, price: 165, gstPercent: 12, line: 330, lineTax: 39.6 }
    ]
  }, {
    subtotal: 610,
    discount: 0,
    tax: 53.6,
    cgst: 26.8,
    sgst: 26.8,
    total: 663.6
  });
});

test('#1002 invoice matches SAVE10 checkout totals and discounted GST', function () {
  const order = {
    id: 1002,
    coupon: 'SAVE10',
    items: [
      item('Rice', 'GRN-001', '1006', 5, 640, 1),
      item('Sunflower Oil', 'OIL-001', '1512', 5, 190, 2)
    ]
  };

  assertInvoiceFigures(order, {
    subtotal: 1020,
    discount: 102,
    tax: 45.9,
    cgst: 22.95,
    sgst: 22.95,
    total: 963.9,
    rows: [
      { name: 'Rice', sku: 'GRN-001', hsn: '1006', qty: 1, price: 640, gstPercent: 5, line: 640, lineTax: 28.8 },
      { name: 'Sunflower Oil', sku: 'OIL-001', hsn: '1512', qty: 2, price: 190, gstPercent: 5, line: 380, lineTax: 17.1 }
    ]
  }, {
    subtotal: 1020,
    discount: 102,
    tax: 45.9,
    cgst: 22.95,
    sgst: 22.95,
    total: 963.9
  });
});

test('#1004 invoice applies the SAVE10 ₹150 checkout discount cap', function () {
  const order = {
    id: 1004,
    coupon: 'SAVE10',
    items: [item('Groundnut Oil', 'OIL-002', '1508', 5, 1120, 2)]
  };

  assertInvoiceFigures(order, {
    subtotal: 2240,
    discount: 150,
    tax: 104.5,
    cgst: 52.25,
    sgst: 52.25,
    total: 2194.5,
    rows: [
      { name: 'Groundnut Oil', sku: 'OIL-002', hsn: '1508', qty: 2, price: 1120, gstPercent: 5, line: 2240, lineTax: 104.5 }
    ]
  }, {
    subtotal: 2240,
    discount: 150,
    tax: 104.5,
    cgst: 52.25,
    sgst: 52.25,
    total: 2194.5
  });
});

test('#1008 invoice matches checkout for 18% items with no coupon', function () {
  const order = {
    id: 1008,
    coupon: '',
    items: [
      item('Tea', 'BEV-001', '0902', 18, 140, 1),
      item('Kokum Concentrate', 'BEV-003', '2106', 18, 180, 2)
    ]
  };

  assertInvoiceFigures(order, {
    subtotal: 500,
    discount: 0,
    tax: 90,
    cgst: 45,
    sgst: 45,
    total: 590,
    rows: [
      { name: 'Tea', sku: 'BEV-001', hsn: '0902', qty: 1, price: 140, gstPercent: 18, line: 140, lineTax: 25.2 },
      { name: 'Kokum Concentrate', sku: 'BEV-003', hsn: '2106', qty: 2, price: 180, gstPercent: 18, line: 360, lineTax: 64.8 }
    ]
  }, {
    subtotal: 500,
    discount: 0,
    tax: 90,
    cgst: 45,
    sgst: 45,
    total: 590
  });
});
