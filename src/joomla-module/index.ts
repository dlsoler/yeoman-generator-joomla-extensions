import Generator from 'yeoman-generator';
import capitalize from 'lodash/capitalize';
import format from 'date-fns/format';
import moduleAnswers from './module-answers';
import TemplatePath from '../app/template-path';
import TemplatePaths from '../app/template-paths';

export default class JoomlaFoF3Generator extends Generator {

  answers: moduleAnswers;

  constructor(args: string | string[], options: {}) {
    super(args, options);
  }

  async prompting() {
    this.answers = await this.prompt([
      {
        type: "input",
        name: "moduleName",
        message: "Module name:",
        validate(input: string) {
          return input.trim().length > 0;
        },
        filter(input: string) {
          return input.toLowerCase();
        }
      },
      {
        type: "input",
        name: "moduleDescription",
        message: "Module description:",
        default(answers: any) {
          const moduleDesc = capitalize(answers.moduleName);
          return `A Joomla module named ${moduleDesc}`
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
        name: "namespace",
        message: "PHP Package",
        default(answers: any) {
          const words: string[] = answers.authorName.split(/[\s_-]/g)
            .map((word: string) => capitalize(word));
          return words.join('');
        },
        validate(input: string) {
          return input.trim().length > 0;
        },
        store: false
      },
      {
        type: "input",
        name: "languagePrefix",
        message: "Language tags prefix",
        default(answers: any) {
          return `MOD_${answers.moduleName.toUpperCase()}`;
        },
        store: false
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
        name: "moduleVersion",
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
    this.answers.moduleName = this.answers.moduleName.toLowerCase();
    this.answers.moduleBuildDate = format(new Date(), 'MMMM do, yyyy');
  }

  writing() {

    const pathToRead : string = this.templatePath('module');
    const prefixTemplatePath: string = this.templatePath('');
    const prefixDestinationPath: string = this.templatePath('module/');
    const templateExtension: string = '.ejs';
    const moduleRename: string = 'module-name';
    const moduleName: string = this.answers.moduleName;

    const templatePaths = new TemplatePaths(pathToRead, prefixTemplatePath, prefixDestinationPath, templateExtension, moduleRename, moduleName);

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
  }
}

