function parseBencode(data) {
    let index = 0;
  
    function parse() {
      const char = data[index];
      if (char === 'i') {
        return parseInteger();
      } else if (char === 'l') {
        return parseList();
      } else if (char === 'd') {
        return parseDictionary();
      } else if (/\d/.test(char)) {
        return parseString();
      } else {
        throw new Error(`Unexpected character at index ${index}: ${char}`);
      }
    }
  
    function parseInteger() {
      index++; // Skip 'i'
      const end = data.indexOf('e', index);
      const num = parseInt(data.slice(index, end), 10);
      index = end + 1; // Skip past 'e'
      return num;
    }
  
    function parseString() {
      const colon = data.indexOf(':', index);
      const length = parseInt(data.slice(index, colon), 10);
      const start = colon + 1;
      const str = data.slice(start, start + length);
      index = start + length;
      return str;
    }
  
    function parseList() {
      index++; // Skip 'l'
      const list = [];
      while (data[index] !== 'e') {
        list.push(parse());
      }
      index++; // Skip 'e'
      return list;
    }
  
    function parseDictionary() {
      index++; // Skip 'd'
      const dict = {};
      while (data[index] !== 'e') {
        const key = parse();
        const value = parse();
        dict[key] = value;
      }
      index++; // Skip 'e'
      return dict;
    }
  
    return parse();
  }

  module.exports = parseBencode
  
  // Example usage
//   const bencodedData = 'd3:bar4:spam3:fooi42ee';
//   const parsedData = parseBencode(bencodedData);
//   console.log(parsedData);
  
