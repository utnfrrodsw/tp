# SQL highlighter for CLI

- based on [doctrine/sql-formatter](https://github.com/doctrine/sql-formatter)
- built for CLI
- (almost) dependency free

## 🚀 Quick Start

```
$ yarn add @mikro-orm/sql-highlighter
```

or

```
$ npm i -s @mikro-orm/sql-highlighter 
```

Usage:

```typescript
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

const highlighter = new SqlHighlighter();
const ret = highlighter.highlight('select 1 + 1');
console.log(ret);
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome. 

## Authors

👤 **Martin Adámek**

- Twitter: [@B4nan](https://twitter.com/B4nan)
- Github: [@b4nan](https://github.com/b4nan)

See also the list of contributors who [participated](https://github.com/mikro-orm/mikro-orm/contributors) in this project.

## Show Your Support

Please ⭐️ this repository if this project helped you!

## 📝 License

Copyright © 2018 [Martin Adámek](https://github.com/b4nan).

This project is licensed under the MIT License - see the [LICENSE file](LICENSE) for details.
