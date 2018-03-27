const packageConfig = require('../package.json');
const applicationConfig = require('./application.config')(packageConfig);

const PasswordService = require('./domain/password/password.service');

const FileService = require('./domain/password-safe/file.service');
const PasswordSafeService = require('./domain/password-safe/password-safe.service');
const SerializationService = require('./domain/password-safe/serialization.service');
const EncryptionService = require('./domain/password-safe/encryption.service');
const PasswordSafeFileProcessor = require('./domain/password-safe/password-safe-file.processor');

const ValidationService = require('./editor/support/validation.service');
const ClipboardService = require('./editor/support/clipboard.service');
const Color = require('./editor/support/color');
const Logger = require('./editor/support/logger');

const Shell = require('./editor/shell/shell');
const ChangeMasterPasswordCommand = require('./editor/shell/command/change-master-password.command');
const GenerateCommand = require('./editor/shell/command/gen.command');
const SetCommand = require('./editor/shell/command/set.command');
const GetCommand = require('./editor/shell/command/get.command');
const CopyCommand = require('./editor/shell/command/copy.command');
const MoveCommand = require('./editor/shell/command/move.command');
const DeleteCommand = require('./editor/shell/command/delete.command');
const ListCommand = require('./editor/shell/command/list.command');
const TreeCommand = require('./editor/shell/command/tree.command');
const EchoCommand = require('./editor/shell/command/echo.command');

const Cli = require('./editor/cli/cli');
const CreateCommand = require('./editor/cli/command/create.command');
const OpenCommand = require('./editor/cli/command/open.command');
const OpenOrCreateCommand = require('./editor/cli/command/open-or-create.command');

const passwordService = new PasswordService(applicationConfig.password);

const fileService = new FileService();
const serializationService = new SerializationService();
const encryptionService = new EncryptionService();
const fileProcessor = new PasswordSafeFileProcessor(
  serializationService,
  encryptionService
);
const passwordSafeService = new PasswordSafeService(fileService, fileProcessor);

const color = new Color(applicationConfig.editor.color);
const logger = new Logger(color);
const clipboardService = new ClipboardService();
const validationService = new ValidationService(applicationConfig);

const createCommand = new CreateCommand(
  applicationConfig.masterPassword,
  passwordSafeService,
  validationService
);
const openCommand = new OpenCommand(passwordSafeService);
const openOrCreateCommand = new OpenOrCreateCommand(
  fileService,
  createCommand,
  openCommand
);

const shellCommands = [
  new ChangeMasterPasswordCommand(
    applicationConfig.masterPassword,
    validationService,
    passwordSafeService
  ),
  new GenerateCommand(
    validationService,
    passwordService,
    applicationConfig.password,
    clipboardService
  ),
  new SetCommand(validationService),
  new GetCommand(clipboardService),
  new DeleteCommand(validationService),
  new CopyCommand(validationService),
  new MoveCommand(validationService),
  new ListCommand(logger),
  new TreeCommand(logger, applicationConfig.key.delimiter),
  new EchoCommand(logger)
]

const shell = new Shell(
  applicationConfig.editor,
  shellCommands,
  passwordSafeService, 
  color, 
  logger
);

const cli = new Cli(
  applicationConfig.application, 
  openOrCreateCommand,
  shell
);

module.exports = {
  cli
};
