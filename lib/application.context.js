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

const Shell = require('./editor/shell/shell');
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

const createCommand = new CreateCommand(
  applicationConfig.masterPassword,
  passwordSafeService
);
const openCommand = new OpenCommand(passwordSafeService);
const openOrCreateCommand = new OpenOrCreateCommand(
  fileService,
  createCommand,
  openCommand
);

const validationService = new ValidationService(applicationConfig);
const color = new Color(applicationConfig.editor.color);
const clipboardService = new ClipboardService();

const shellCommands = [
  new CopyCommand(validationService),
  new MoveCommand(validationService),
  new ListCommand(),
  new TreeCommand(),
  new EchoCommand()
];

const shellCommands2 = [
  new GenerateCommand(
    validationService,
    passwordService,
    applicationConfig.password,
    clipboardService
  ),
  new SetCommand(validationService, passwordService),
  new GetCommand(clipboardService),
  new DeleteCommand(validationService),
  
  
]

const shell = new Shell(shellCommands, shellCommands2, passwordSafeService, color);

const cli = new Cli(applicationConfig.application, openOrCreateCommand, shell);

module.exports = {
  cli
};
