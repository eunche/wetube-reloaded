// x는 숫자
export default function addComma(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }