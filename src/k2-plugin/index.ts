import Generator from 'yeoman-generator';
import capitalize from 'lodash/capitalize';
import format from 'date-fns/format';
import pluginAnswers from './plugin-answers';
import TemplatePath from '../app/template-path';
import TemplatePaths from '../app/template-paths';

export default class K2PluginGenerator extends Generator {

  answers: pluginAnswers;

  constructor(args: string | string[], options: {}) {
    super(args, options);
  }

  async prompting() {
    this.answers = await this.prompt([
      {
        type: "input",
        name: "pluginName",
        message: "Plugin name:",
        validate(input: string) {
          return input.trim().length > 0;
        },
        filter(input: string) {
          return input.toLowerCase();
        }
      },
      {
        type: "input",
        name: "pluginDescription",
        message: "Plugin description:",
        default(answers: any) {
          const pluginDesc = capitalize(answers.pluginName);
          return `K2 plugin named ${pluginDesc}`
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
        name: "languagePrefix",
        message: "Language tags prefix",
        default(answers: any) {
          return `MOD_${answers.pluginName.toUpperCase()}`;
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
        name: "pluginVersion",
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
    this.answers.pluginName = this.answers.pluginName.toLowerCase();
    this.answers.pluginBuildDate = format(new Date(), 'MMMM do, yyyy');
    this.answers.phpClassSuffix = capitalize(this.answers.pluginName);
  }

  writing() {

    const pathToRead : string = this.templatePath('k2-plugin');
    const prefixTemplatePath: string = this.templatePath('');
    const prefixDestinationPath: string = this.templatePath('k2-plugin/');
    const templateExtension: string = '.ejs';
    const pluginRename: string = 'plugin-name';
    const pluginName: string = this.answers.pluginName;

    const templatePaths = new TemplatePaths(pathToRead, prefixTemplatePath, prefixDestinationPath, templateExtension, pluginRename, pluginName);

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

