import { applicationInfo } from './application.info';
import { applicationConfig } from './application.config';
import { PasswordService } from './domain/password';
import {
  EncryptionService,
  FileService,
  PasswordSafeFileProcessor,
  PasswordSafeService,
  SerializationService
} from './domain/password-safe';
import { ValidationService } from './editor/support/validation.service';
import { ClipboardService } from './editor/support/clipboard.service';
import { Color } from './editor/support/color';
import { Logger } from './editor/support/logger';
import { PromptService } from './editor/support/prompt.service';
import { Shell } from './editor';
import { CreateCommand, OpenCommand, OpenOrCreateCommand } from './editor/cli/command';
import {
  ChangeMasterPasswordCommand,
  CopyCommand,
  DeleteCommand,
  EchoCommand,
  ExportCommand,
  GenerateCommand,
  GetCommand,
  HistoryCommand,
  ListCommand,
  MoveCommand,
  SetCommand,
  TreeCommand
} from './editor/shell/command';
import { Cli } from './editor/cli';


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
const promptService = new PromptService();

const createCommand = new CreateCommand(
  passwordSafeService,
  validationService,
  promptService
);
const openCommand = new OpenCommand(passwordSafeService, promptService);
const openOrCreateCommand = new OpenOrCreateCommand(
  fileService,
  createCommand,
  openCommand
);

const shellCommands = [
  new ChangeMasterPasswordCommand(
    validationService,
    promptService
  ),
  new GenerateCommand(
    validationService,
    passwordService,
    applicationConfig.password,
    clipboardService
  ),
  new SetCommand(validationService, promptService),
  new GetCommand(clipboardService),
  new DeleteCommand(validationService),
  new CopyCommand(validationService),
  new MoveCommand(validationService),
  new ListCommand(logger),
  new TreeCommand(logger, applicationConfig.key.delimiter),
  new EchoCommand(logger),
  new ExportCommand(clipboardService),
  new HistoryCommand(logger)
].sort((a, b) => a.definition.usage.localeCompare(b.definition.usage));

const shell = new Shell(
  applicationConfig.editor,
  shellCommands,
  passwordSafeService,
  color,
  logger
);

export const cli = new Cli(applicationInfo, openOrCreateCommand, shell);
