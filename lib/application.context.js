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

const Color = require('./interface/support/color');

const Shell = require('./interface/shell/shell');
const GenerateCommand = require('./interface/shell/command/gen.command');
const SetCommand = require('./interface/shell/command/set.command');
const GetCommand = require('./interface/shell/command/get.command');
const DeleteCommand = require('./interface/shell/command/delete.command');
const ListCommand = require('./interface/shell/command/list.command');

const Cli = require('./interface/cli/cli');
const OpenCommand = require('./interface/cli/command/open.command');

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

const openCommand = new OpenCommand(passwordSafeService, promptService);

const color = new Color(applicationConfig.display.color);

const shellCommands = [
  new GenerateCommand(applicationConfig, passwordService, clipboardService),
  new SetCommand(passwordService),
  new GetCommand(clipboardService),
  new DeleteCommand(),  
  new ListCommand()
];

const shell = new Shell(shellCommands, passwordSafeService, color);

const cli = new Cli(applicationConfig.interface, openCommand, shell);

module.exports = {
  cli
}