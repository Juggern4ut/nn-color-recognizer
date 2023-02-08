"use strict";
// Other techniques for learning
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeuralNetwork = exports.ActivationFunction = void 0;
const matrix_1 = __importDefault(require("./matrix"));
class ActivationFunction {
    constructor(func, dfunc) {
        this.func = func;
        this.dfunc = dfunc;
    }
}
exports.ActivationFunction = ActivationFunction;
let sigmoid = new ActivationFunction(x => 1 / (1 + Math.exp(-x)), y => y * (1 - y));
let tanh = new ActivationFunction(x => Math.tanh(x), y => 1 - (y * y));
class NeuralNetwork {
    /*
    * if first argument is a NeuralNetwork the constructor clones it
    * USAGE: cloned_nn = new NeuralNetwork(to_clone_nn);
    */
    constructor(in_nodes, hid_nodes, out_nodes) {
        if (in_nodes instanceof NeuralNetwork) {
            let a = in_nodes;
            this.input_nodes = a.input_nodes;
            this.hidden_nodes = a.hidden_nodes;
            this.output_nodes = a.output_nodes;
            this.weights_ih = a.weights_ih.copy();
            this.weights_ho = a.weights_ho.copy();
            this.bias_h = a.bias_h.copy();
            this.bias_o = a.bias_o.copy();
        }
        else {
            this.input_nodes = in_nodes;
            this.hidden_nodes = hid_nodes;
            this.output_nodes = out_nodes;
            this.weights_ih = new matrix_1.default(this.hidden_nodes, this.input_nodes);
            this.weights_ho = new matrix_1.default(this.output_nodes, this.hidden_nodes);
            this.weights_ih.randomize();
            this.weights_ho.randomize();
            this.bias_h = new matrix_1.default(this.hidden_nodes, 1);
            this.bias_o = new matrix_1.default(this.output_nodes, 1);
            this.bias_h.randomize();
            this.bias_o.randomize();
        }
        // TODO: copy these as well
        this.setLearningRate();
        this.setActivationFunction();
    }
    predict(input_array) {
        // Generating the Hidden Outputs
        let inputs = matrix_1.default.fromArray(input_array);
        let hidden = matrix_1.default.multiply(this.weights_ih, inputs);
        hidden.add(this.bias_h);
        // activation function!
        hidden.map(this.activation_function.func);
        // Generating the output's output!
        let output = matrix_1.default.multiply(this.weights_ho, hidden);
        output.add(this.bias_o);
        output.map(this.activation_function.func);
        // Sending back to the caller!
        return output.toArray();
    }
    setLearningRate(learning_rate = 0.1) {
        this.learning_rate = learning_rate;
    }
    setActivationFunction(func = sigmoid) {
        this.activation_function = func;
    }
    train(input_array, target_array) {
        // Generating the Hidden Outputs
        let inputs = matrix_1.default.fromArray(input_array);
        let hidden = matrix_1.default.multiply(this.weights_ih, inputs);
        hidden.add(this.bias_h);
        // activation function!
        hidden.map(this.activation_function.func);
        // Generating the output's output!
        let outputs = matrix_1.default.multiply(this.weights_ho, hidden);
        outputs.add(this.bias_o);
        outputs.map(this.activation_function.func);
        // Convert array to matrix object
        let targets = matrix_1.default.fromArray(target_array);
        // Calculate the error
        // ERROR = TARGETS - OUTPUTS
        let output_errors = matrix_1.default.subtract(targets, outputs);
        // let gradient = outputs * (1 - outputs);
        // Calculate gradient
        let gradients = matrix_1.default.map(outputs, this.activation_function.dfunc);
        gradients.multiply(output_errors);
        gradients.multiply(this.learning_rate);
        // Calculate deltas
        let hidden_T = matrix_1.default.transpose(hidden);
        let weight_ho_deltas = matrix_1.default.multiply(gradients, hidden_T);
        // Adjust the weights by deltas
        this.weights_ho.add(weight_ho_deltas);
        // Adjust the bias by its deltas (which is just the gradients)
        this.bias_o.add(gradients);
        // Calculate the hidden layer errors
        let who_t = matrix_1.default.transpose(this.weights_ho);
        let hidden_errors = matrix_1.default.multiply(who_t, output_errors);
        // Calculate hidden gradient
        let hidden_gradient = matrix_1.default.map(hidden, this.activation_function.dfunc);
        hidden_gradient.multiply(hidden_errors);
        hidden_gradient.multiply(this.learning_rate);
        // Calcuate input->hidden deltas
        let inputs_T = matrix_1.default.transpose(inputs);
        let weight_ih_deltas = matrix_1.default.multiply(hidden_gradient, inputs_T);
        this.weights_ih.add(weight_ih_deltas);
        // Adjust the bias by its deltas (which is just the gradients)
        this.bias_h.add(hidden_gradient);
        // outputs.print();
        // targets.print();
        // error.print();
    }
    serialize() {
        return JSON.stringify(this);
    }
    static deserialize(data) {
        if (typeof data == 'string') {
            data = JSON.parse(data);
        }
        let nn = new NeuralNetwork(data.input_nodes, data.hidden_nodes, data.output_nodes);
        nn.weights_ih = matrix_1.default.deserialize(data.weights_ih);
        nn.weights_ho = matrix_1.default.deserialize(data.weights_ho);
        nn.bias_h = matrix_1.default.deserialize(data.bias_h);
        nn.bias_o = matrix_1.default.deserialize(data.bias_o);
        nn.learning_rate = data.learning_rate;
        return nn;
    }
    // Adding function for neuro-evolution
    copy() {
        return new NeuralNetwork(this);
    }
    // Accept an arbitrary function for mutation
    mutate(func) {
        this.weights_ih.map(func);
        this.weights_ho.map(func);
        this.bias_h.map(func);
        this.bias_o.map(func);
    }
}
exports.NeuralNetwork = NeuralNetwork;
//# sourceMappingURL=nn.js.map