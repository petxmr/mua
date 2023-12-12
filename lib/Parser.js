class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.current_token = this.tokens[0];
        this.current_index = 0;
    }

    parse() {
        return this.parse_expression();
    }

    parse_expression() {
        let node = this.parse_term();
    
        while (this.current_token && this.current_token.type === 'OPERATOR' && (this.current_token.value === '+' || this.current_token.value === '-')) {
            const operator = this.current_token.value;
            this.advance();
            const right_node = this.parse_term();
            node = { type: 'BinaryExpression', operator, left: node, right: right_node };
        }

        return node;
    }

    parse_term() {
        let node = this.parse_factor();
    
        while (this.current_token && this.current_token.type === 'OPERATOR' && (this.current_token.value === '*' || this.current_token.value === '/')) {
          const operator = this.current_token.value;
          this.advance();
          const right_node = this.parse_factor();
          node = { type: 'BinaryExpression', operator, left: node, right: right_node };
        }
    
        return node;
      }

    parse_factor() {
        // Check for digits
        if (this.current_token && this.current_token.type === 'DIGIT') {
            const node = { type: 'DigitLiteral', value: this.current_token.value };
            this.advance();
            return node;
        // Check for open parentheses
        } else if (this.current_token && this.current_token.type === 'OPEN_PAREN') {
            // Take '('
            this.advance();
            const expression_node = this.parse_expression();

            // Check for closed parentheses
            if (this.current_token && this.current_token.type === 'CLOSE_PAREN') {
                this.advance();
                return expression_node;
            } else {
                throw new Error('Expected closing parentheses');
            }
        }

        throw new Error('Unexpected token: ' + JSON.stringify(this.current_token));
    }

    advance() {
        this.current_index++;
        this.current_token = this.tokens[this.current_index];
    }
}

module.exports = Parser