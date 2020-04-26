import path from 'path';
import readdir from 'recursive-readdir';
import TemplatePath from './template-path';



export default class TemplatePaths {
  pathToRead: string;
  prefixTemplatePath: string;
  prefixDestinationPath: string;
  templateExtension: string;
  componentRename: string;
  componentName: string;
  constructor(pathToRead: string, prefixTemplatePath: string, prefixDestinationPath: string, templateExtension: string, componentRename: string, componentName: string) {
    this.pathToRead = pathToRead;
    this.prefixTemplatePath = prefixTemplatePath;
    this.prefixDestinationPath = prefixDestinationPath;
    this.templateExtension = templateExtension;
    this.componentRename = componentRename;
    this.componentName = componentName;
  }

  /**
   * Check if the file is an ejs template
   * @param {string} pathname The path of file to check
   * @returns {boolean} True if the file is an ejs template
   */
  isTemplate(pathname: string) : boolean {
    const extension = path.extname(pathname).toLocaleLowerCase();
    return extension === this.templateExtension;
  }

  /**
   * Returns the destination path for a file
   * @param {string} pathname The pathname of file to be processed
   * @returns {string} The destination pathname
   */
  destinationPath(pathname: string) {
    const regexp = new RegExp(`${this.templateExtension}$`, 'i');
    const tmp = pathname.replace(this.prefixDestinationPath, '')
      .replace(this.componentRename, this.componentName)
      .replace(regexp, '');
    return tmp;
  }

  getTemplatePaths() : Promise<TemplatePath[]> {
    return readdir(this.pathToRead).then(
      (files) => {
        const modifiedFiles: TemplatePath[] = files.map((pathname) => {
          const templatePath = pathname.replace(this.prefixTemplatePath, '').replace(/^\//, '');
          const destinationPath = this.destinationPath(pathname);
          const isTemplate = this.isTemplate(pathname);
          return new TemplatePath(templatePath, destinationPath, isTemplate);
        });
        return modifiedFiles;
    });
  }
}

// export const backendPaths: TemplatePath[] = [
//   /* ----- COMPONENT MANIFEST ----- */
//   {
//     templatePath: 'component/manifest.xml.ejs',
//     destinationPath: 'manifest.xml'
//   },
//   /* ----- COMPONENT BACKEND ----- */
//   {
//     templatePath: 'component/backend/index.html.ejs',
//     destinationPath: 'backend/index.html'
//   },
//   // Toolbar
//   {
//     templatePath: 'component/backend/toolbar.php.ejs',
//     destinationPath: 'backend/toolbar.php'
//   },
//   // fof.xml.ejs
//   {
//     templatePath: 'component/backend/fof.xml.ejs',
//     destinationPath: 'backend/fof.xml'
//   },
//   // dispatcher
//   {
//     templatePath: 'component/backend/dispatcher.php.ejs',
//     destinationPath: 'backend/dispatcher.php'
//   },
//   // config
//   {
//     templatePath: 'component/backend/config.xml.ejs',
//     destinationPath: 'backend/config.xml'
//   },
//   // access
//   {
//     templatePath: 'component/backend/access.xml.ejs',
//     destinationPath: 'backend/access.xml'
//   },
//   // Fields examples
//   {
//     templatePath: 'component/backend/fields/duedate.php.ejs',
//     destinationPath: 'backend/fields/duedate.php'
//   },
//   {
//     templatePath: 'component/backend/fields/frontendlink.php.ejs',
//     destinationPath: 'backend/fields/frontendlink.php'
//   },
//   {
//     templatePath: 'component/backend/fields/frontendlink.php.ejs',
//     destinationPath: 'backend/fields/frontendlink.php'
//   },
//   // SQL install
//   {
//     templatePath: 'component/backend/sql/install/index.html.ejs',
//     destinationPath: 'backend/sql/install/index.html'
//   },
//     // MySQL install
//   {
//     templatePath: 'component/backend/sql/install/mysql/index.html.ejs',
//     destinationPath: 'backend/sql/install/mysql/index.html'
//   },
//   {
//     templatePath: 'component/backend/sql/install/mysql/install.sql.ejs',
//     destinationPath: 'backend/sql/install/mysql/install.sql'
//   },
//   // MySQL uninstall
//   {
//     templatePath: 'component/backend/sql/install/mysql/uninstall.sql.ejs',
//     destinationPath: 'backend/sql/install/mysql/uninstall.sql'
//   },
//   // Updates
//   {
//     templatePath: 'component/backend/sql/updates/index.html.ejs',
//     destinationPath: 'backend/sql/updates/index.html'
//   },
//   {
//     templatePath: 'component/backend/sql/updates/mysql/2.0.0-2020-02-01.sql.ejs',
//     destinationPath: 'backend/sql/updates/mysql/2.0.0-2020-02-01.sql'
//   },
//   {
//     templatePath: 'component/backend/sql/updates/mysql/index.html.ejs',
//     destinationPath: 'backend/sql/updates/mysql/index.html'
//   },
//   // Tables
//   {
//     templatePath: 'component/backend/tables/index.html.ejs',
//     destinationPath: 'backend/tables/index.html'
//   },
//   {
//     templatePath: 'component/backend/tables/item.php.ejs',
//     destinationPath: 'backend/tables/item.php'
//   },
//   // Views
//   {
//     templatePath: 'component/backend/views/index.html.ejs',
//     destinationPath: 'backend/views/index.html'
//   },
//   // Item view
//   {
//     templatePath: 'component/backend/views/item/index.html.ejs',
//     destinationPath: 'backend/views/item/index.html'
//   },
//   // Item view tmpl
//   {
//     templatePath: 'component/backend/views/item/tmpl/form.form.xml.ejs',
//     destinationPath: 'backend/views/item/tmpl/form.form.xml'
//   },
//   {
//     templatePath: 'component/backend/views/item/tmpl/index.html.ejs',
//     destinationPath: 'backend/views/item/tmpl/index.html'
//   },
//   // Items view
//   {
//     templatePath: 'component/backend/views/items/index.html.ejs',
//     destinationPath: 'backend/views/items/index.html'
//   },
//   // Items view tmpl
//   {
//     templatePath: 'component/backend/views/items/tmpl/form.default.xml.ejs',
//     destinationPath: 'backend/views/items/tmpl/form.default.xml'
//   },
//   {
//     templatePath: 'component/backend/views/items/tmpl/index.html.ejs',
//     destinationPath: 'backend/views/items/tmpl/index.html'
//   },
// ];

// export const frontendPaths: TemplatePath[] = [
//   // Frontend
//   {
//     templatePath: 'component/frontend/index.html.ejs',
//     destinationPath: 'frontend/index.html.ejs'
//   },
//   // Frontend toolbar
//   {
//     templatePath: 'component/frontend/toolbar.php.ejs',
//     destinationPath: 'frontend/toolbar.php'
//   },
//   // Frontend controllers
//   {
//     templatePath: 'component/frontend/controllers/index.html.ejs',
//     destinationPath: 'frontend/controllers/index.html'
//   },
//   {
//     templatePath: 'component/frontend/controllers/items.php.ejs',
//     destinationPath: 'frontend/controllers/items.php'
//   },
//   // Frontend Views
//   {
//     templatePath: 'component/frontend/views/index.html.ejs',
//     destinationPath: 'frontend/views/index.html'
//   },
//   // Frontend View Item
//   {
//     templatePath: 'component/frontend/views/item/tmpl/form.form.xml.ejs',
//     destinationPath: 'frontend/views/item/tmpl/form.form.xml'
//   },
//   {
//     templatePath: 'component/frontend/views/item/tmpl/form.item.xml.ejs',
//     destinationPath: 'frontend/views/item/tmpl/form.item.xml'
//   },
//   {
//     templatePath: 'component/frontend/views/item/tmpl/index.html.ejs',
//     destinationPath: 'frontend/views/item/tmpl/index.html'
//   },
//   {
//     templatePath: 'component/frontend/views/item/index.html.ejs',
//     destinationPath: 'frontend/views/item/index.html'
//   },
//   {
//     templatePath: 'component/frontend/views/item/metadata.xml.ejs',
//     destinationPath: 'frontend/views/item/metadata.xml'
//   },
//   // Frontend View Items
//   {
//     templatePath: 'component/frontend/views/items/tmpl/form.default.xml.ejs',
//     destinationPath: 'frontend/views/items/tmpl/form.default.xml'
//   },
//   {
//     templatePath: 'component/frontend/views/items/tmpl/index.html.ejs',
//     destinationPath: 'frontend/views/items/tmpl/index.html'
//   },
//   {
//     templatePath: 'component/frontend/views/items/index.html.ejs',
//     destinationPath: 'frontend/views/items/index.html'
//   },
//   {
//     templatePath: 'component/frontend/views/items/metadata.xml.ejs',
//     destinationPath: 'frontend/views/items/metadata.xml'
//   }
// ];

// export const imagePaths: TemplatePath[] = [
//   {
//     templatePath: 'component/media/images/icon-16.jpg',
//     destinationPath: 'media/images/icon-16.jpg'
//   },
//   {
//     templatePath: 'component/media/images/icon-16.png',
//     destinationPath: 'media/images/icon-16.png'
//   },
//   {
//     templatePath: 'component/media/images/icon-24.png',
//     destinationPath: 'media/images/icon-24.png'
//   },
//   {
//     templatePath: 'component/media/images/icon-32.jpg',
//     destinationPath: 'media/images/icon-32.jpg'
//   },
//   {
//     templatePath: 'component/media/images/icon-32.png',
//     destinationPath: 'media/images/icon-32.png'
//   },
//   {
//     templatePath: 'component/media/images/icon-48.jpg',
//     destinationPath: 'media/images/icon-48.jpg'
//   },
//   {
//     templatePath: 'component/media/images/icon-48.png',
//     destinationPath: 'media/images/icon-48.png'
//   },
//   {
//     templatePath: 'component/media/images/icon-64.jpg',
//     destinationPath: 'media/images/icon-64.jpg'
//   },
//   {
//     templatePath: 'component/media/images/icon-64.png',
//     destinationPath: 'media/images/icon-64.png'
//   },
//   {
//     templatePath: 'component/media/images/icon-128.jpg',
//     destinationPath: 'media/images/icon-128.jpg'
//   },
//   {
//     templatePath: 'component/media/images/icon-128.png',
//     destinationPath: 'media/images/icon-128.png'
//   },
//   {
//     templatePath: 'component/media/images/icon-256.jpg',
//     destinationPath: 'media/images/icon-256.jpg'
//   },
//   {
//     templatePath: 'component/media/images/icon-256.png',
//     destinationPath: 'media/images/icon-256.png'
//   },
// ];
