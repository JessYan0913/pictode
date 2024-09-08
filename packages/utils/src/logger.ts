type LogType = 'warning' | 'info' | 'error';

interface LoggerOptions {
  warningTitleBgColor?: string;
  warningKeyColor?: string;
  infoTitleBgColor?: string;
  infoKeyColor?: string;
  errorTitleBgColor?: string;
  errorKeyColor?: string;
}

interface LogStyles {
  title: string;
  text: string;
  key: string;
  end: string;
}

export class Logger {
  private productName: string;
  private styles: Record<LogType, LogStyles>;

  constructor(productName: string, options: LoggerOptions = {}) {
    this.productName = productName;

    this.styles = {
      warning: {
        title: `background-color: ${
          options.warningTitleBgColor || 'orange'
        }; color: white; font-weight: bold; padding: 2px 4px; border-radius: 4px 0 0 4px;`,
        text: 'background-color: black; color: white; font-weight: bold; padding: 2px;',
        key: `background-color: black; color: ${options.warningKeyColor || 'yellow'}; font-weight: bold; padding: 2px;`,
        end: 'background-color: black; color: white; font-weight: bold; padding: 2px; border-radius: 0 4px 4px 0;',
      },
      info: {
        title: `background-color: ${
          options.infoTitleBgColor || 'green'
        }; color: white; font-weight: bold; padding: 2px 4px; border-radius: 4px 0 0 4px;`,
        text: 'background-color: black; color: white; padding: 2px;',
        key: `background-color: black; color: ${options.infoKeyColor || 'lightgreen'}; padding: 2px;`,
        end: 'background-color: black; color: white; padding: 2px; border-radius: 0 4px 4px 0;',
      },
      error: {
        title: `background-color: ${
          options.errorTitleBgColor || 'purple'
        }; color: white; font-weight: bold; padding: 2px 4px; border-radius: 4px 0 0 4px;`,
        text: 'background-color: black; color: white; padding: 2px;',
        key: `background-color: black; color: ${options.errorKeyColor || 'red'}; font-weight: bold; padding: 2px;`,
        end: 'background-color: black; color: white; padding: 2px; border-radius: 0 4px 4px 0;',
      },
    };
  }

  private log(type: LogType, message: string): void {
    if (!this.styles[type]) {
      console.error(`Logger: Unknown log type "${type}".`);
      return;
    }

    const style = this.styles[type];

    // 查找所有使用模板语法的占位符，并分隔出普通文本和关键字
    const messageParts = message.split(/(\{{[^}]+}})/).filter(Boolean);
    const formattedMessage: string[] = [];
    const formattedStyles: string[] = [];

    messageParts.forEach((part) => {
      if (part.startsWith('{{') && part.endsWith('}}')) {
        // 如果是关键字占位符，应用关键字样式
        formattedMessage.push(`%c${part.slice(2, -2)}`);
        formattedStyles.push(style.key);
      } else {
        // 否则，应用普通文本样式
        formattedMessage.push(`%c${part}`);
        formattedStyles.push(style.text);
      }
    });

    console.log(
      `%c${this.productName} - ${type.toUpperCase()}%c ${formattedMessage.join('')}`,
      style.title,
      style.text,
      ...formattedStyles,
    );
  }

  public warning(message: string): void {
    this.log('warning', message);
  }

  public info(message: string): void {
    this.log('info', message);
  }

  public error(message: string): void {
    this.log('error', message);
  }
}

export default new Logger('Pictode');
