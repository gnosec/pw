const packageConfig = require('../package.json')
const applicationConfig = require('./application.config')(packageConfig);

const FileService = require('./domain/file.service');
const PromptService = require('./domain/prompt.service');
const QuestionProvider = require('./domain/question.provider');
const PasswordSafeServie = require('./domain/password-safe.service');
const PasswordService = require('./domain/password.service');
const SerializationService = require('./domain/serialization.service');
const EncryptionService = require('./domain/encryption.service');
const PasswordSafeFileProcessor = require('./domain/password-safe-file.processor');
const ClipboardService = require('./domain/clipboard.service');

const Color = require('./editor/support/color');

const Shell = require('./editor/shell/shell');
const GenerateCommand = require('./editor/shell/command/gen.command');
const SetCommand = require('./editor/shell/command/set.command');
const GetCommand = require('./editor/shell/command/get.command');
const DeleteCommand = require('./editor/shell/command/delete.command');
const ListCommand = require('./editor/shell/command/list.command');

const Cli = require('./editor/cli/cli');
const CreateCommand = require('./editor/cli/command/create.command');
const OpenCommand = require('./editor/cli/command/open.command');
const OpenOrCreateCommand = require('./editor/cli/command/open-or-create.command');

const fileService = new FileService();
const clipboardService = new ClipboardService();
const serializationService = new SerializationService();
const encryptionService = new EncryptionService();
const questionProvider = new QuestionProvider(applicationConfig);
const passwordService = new PasswordService(applicationConfig);
const fileProcessor = new PasswordSafeFileProcessor(
  serializationService,
  encryptionService
);
const passwordSafeService = new PasswordSafeServie(fileService, fileProcessor);
const promptService = new PromptService(questionProvider);

const createCommand = new CreateCommand(promptService, passwordSafeService);
const openCommand = new OpenCommand(promptService, passwordSafeService);
const openOrCreateCommand = new OpenOrCreateCommand(fileService, createCommand, openCommand);

const color = new Color(applicationConfig.editor.color);

const shellCommands = [
  new GenerateCommand(applicationConfig, passwordService, clipboardService),
  new SetCommand(passwordService),
  new GetCommand(clipboardService),
  new DeleteCommand(),  
  new ListCommand()
];

const shell = new Shell(shellCommands, passwordSafeService, color);

const cli = new Cli(applicationConfig.interface, openOrCreateCommand, shell);

module.exports = {
  cli
}
