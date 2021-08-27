const numbers = [1, 2, 3, 4, 5]

function isLessThan3(number) {
    return number < 3
}

// console.log(numbers.filter(isLessThan3)) //[1,2]
// console.log(numbers.filter(number => number < 3)) //[1,2]
console.log(numbers.filter(number => {
        return number < 3
    })) //[1,2]


// 相同的陣列
let people = [{
        name: 'Casper',
        like: '鍋燒意麵',
        age: 18
    },
    {
        name: 'Wang',
        like: '炒麵',
        age: 24
    },
    {
        name: 'Bobo',
        like: '蘿蔔泥',
        age: 1
    },
    {
        name: '滷蛋',
        like: '蘿蔔泥',
        age: 3
    }
];

let filterAgeThen5 = people.filter((item, index, array) => {
    return item.age > 5
})
console.log(filterAgeThen5)

//  只會回傳一次值
let findAgeThen5 = people.find((item, index, array) => {
    return item.age > 5
})
console.log(findAgeThen5)

// 
let mapAgeThan5 = people.map((item, index, array) => {
    return item.age > 5; // 比較大於五歲的
});
console.log(mapAgeThan5); // [true, true, false, false]