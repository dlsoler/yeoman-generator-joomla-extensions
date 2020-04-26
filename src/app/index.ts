import Generator from 'yeoman-generator';
import capitalize from 'lodash/capitalize';
import format from 'date-fns/format';
import ComponentAnswers from './component-answers';
import TemplatePath from './template-path';
import TemplatePaths from './template-paths';

export default class JoomlaFoF3Generator extends Generator {

  answers: ComponentAnswers;

  constructor(args: string | string[], options: {}) {
    super(args, options);
  }

  async prompting() {
    this.answers = await this.prompt([
      {
        type: "input",
        name: "componentName",
        message: "Component name:",
        validate(input: string) {
          return input.trim().length > 0;
        },
        filter(input: string) {
          return input.toLowerCase();
        }
      },
      {
        type: "input",
        name: "componentDescription",
        message: "Component description:",
        default(answers: any) {
          const componentDesc = capitalize(answers.componentName);
          return `A Joomla component named ${componentDesc}`
        }
      },
      {
        type: "input",
        name: "authorName",
        message: "Author name:",
        store: true
      },
      {
        type: "input",
        name: "authorEmail",
        message: "Author email",
        store: true
      },
      {
        type: "input",
        name: "authorURL",
        message: "Author URL",
        default(answers) {
          const siteName = answers.authorName.replace(/\s/g, '').toLowerCase();
          return `https://${siteName}.com`;
        },
        store: true
      },
      {
        type: "input",
        name: "phpClass",
        message: "Component PHP class name",
        default(answers: any) {
          return capitalize(answers.componentName);
        },
        validate(input: string) {
          return input.trim().length > 0;
        },
        filter(input: string) {
          return capitalize(input);
        }
      },
      {
        type: "input",
        name: "namespace",
        message: "PHP Namespace Root",
        default(answers: any) {
          const words: string[] = answers.authorName.split(/[\s_-]/g)
            .map((word: string) => capitalize(word));
          return `${words.join('')}\\${capitalize(answers.componentName)}`;
        },
        validate(input: string) {
          return input.trim().length > 0;
        }
      },
      {
        type: "input",
        name: "languagePrefix",
        message: "Language tags prefix",
        default(answers: any) {
          return `COM_${answers.componentName.toUpperCase()}`;
        }
      },
      {
        type: "input",
        name: "copyright",
        message: "Copyright",
        default(answers) {
          const year = new Date().getFullYear();
          return `Copyright (c) ${year} - ${answers.authorName}`
        },
        store: true
      },
      {
        type: "input",
        name: "componentVersion",
        message: "Version",
        default: "0.1.0"
      },
      {
        type: "input",
        name: "license",
        message: "License",
        default: "GPL-3.0"
      }
    ]);
    this.answers.componentName = this.answers.componentName.toLowerCase();
    this.answers.componentBuildDate = format(new Date(), 'MMMM do, yyyy');
  }

  writing() {

    const pathToRead : string = this.templatePath('component');
    const prefixTemplatePath: string = this.templatePath('');
    const prefixDestinationPath: string = this.templatePath('component/');
    const templateExtension: string = '.ejs';
    const componentRename: string = 'component-name';
    const componentName: string = this.answers.componentName;

    const templatePaths = new TemplatePaths(pathToRead, prefixTemplatePath, prefixDestinationPath, templateExtension, componentRename, componentName);

    templatePaths.getTemplatePaths()
      .then((tps: TemplatePath[]) => {
        tps.forEach((item: TemplatePath) => {
          if(item.isTemplate) {
            // Process the file as an ejs
            this.fs.copyTpl(
              this.templatePath(item.templatePath),
              this.destinationPath(item.destinationPath),
              this.answers
            );
            return;
          }
          // The file is not processed
          this.fs.copy(
            this.templatePath(item.templatePath),
            this.destinationPath(item.destinationPath)
          );
        })
      });

    // this._writingBackend();
    // this._writingFrontend();
    // this._writingLanguage();
    // this._writingMedia();
  }
}

