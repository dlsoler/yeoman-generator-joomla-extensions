export default class TemplatePath {
  templatePath: string;
  destinationPath: string;
  isTemplate: boolean;
  constructor(templatePath: string, destinationPath: string, isTemplate: boolean) {
    this.templatePath = templatePath;
    this.destinationPath = destinationPath;
    this.isTemplate = isTemplate;
  }
}
