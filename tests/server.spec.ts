import { expect } from "chai";
import { is, not, and, any } from '../app/utils';

describe('Currified functions', () => {
  it('is()', () => {
    expect(is('number')(114)).to.be.true;
    expect(is('number')(-514)).to.be.true;
    expect(is('number')(Infinity)).to.be.true;
    expect(is('number')(NaN)).to.be.true;
    expect(is('number')('hello')).to.be.false;
    expect(is('number')('')).to.be.false;
    expect(is('number')([])).to.be.false;
    expect(is('number')('0')).to.be.false;
    expect(is('number')({})).to.be.false;
    expect(is('number')(Object.create(null))).to.be.false;
    expect(is('number')(true)).to.be.false;

    expect(is('string')('2333')).to.be.true;
    expect(is('string')('')).to.be.true;
    expect(is('string')('你们啊，还是太年轻了')).to.be.true;
    expect(is('string')(233)).to.be.false;
    expect(is('string')(Infinity)).to.be.false;
    expect(is('string')(is)).to.be.false;
    expect(is('string')({})).to.be.false;
    expect(is('string')(['233'])).to.be.false;
    expect(is('string')(['2', '2'])).to.be.false;
    expect(is('string')(Buffer.from('2333'))).to.be.false;
  });

  it('not()', () => {
    expect(not(is('number'))(233)).to.be.false;
    expect(not(is('number'))(true)).to.be.true;
    expect(not(is('number'))('2333')).to.be.true;
    expect(not(is('number'))(undefined)).to.be.true;
    expect(not(is('number'))([])).to.be.true;
  });

  it('any()', () => {
    expect(any(is('number'))([2, 3, 4])).to.be.true;
    expect(any(is('number'))([2, undefined, undefined])).to.be.true;
    expect(any(is('number'))([undefined, undefined, undefined])).to.be.false;
    expect(any(is('number'))([])).to.be.false;
    expect(any(is('number'))(['233', null])).to.be.false;
  });

  it('and()', () => {
    const f = (x: number) => x > 0;
    const g = (x: number) => x < 3;
    expect(and(f, g)(-1)).to.be.false;
    expect(and(f, g)(0)).to.be.false;
    expect(and(f, g)(1)).to.be.true;
    expect(and(f, g)(2)).to.be.true;
    expect(and(f, g)(3)).to.be.false;
    expect(and(f, g)(4)).to.be.false;
  });

});
