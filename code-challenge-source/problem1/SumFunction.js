// Using for Loop
var sum_to_n_a = function (n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};
// Example usage:
console.log(sum_to_n_a(5)); // Output: 15

// Using the Arithmetic Formula
var sum_to_n_b = function (n) {
    return n * (n + 1) / 2; 
};

// Example usage:
console.log(sum_to_n_b(5)); // Output: 15

// Using Recursion
var sum_to_n_c = function (n) {
    if (n === 1) { // Base case: if n is 1, return 1
        return 1;
    }
    return n + sum_to_n_c(n - 1); // Recursively calculate the sum of the first n-1 numbers and add n
};

// Example usage:
console.log(sum_to_n_c(5)); // Output: 15