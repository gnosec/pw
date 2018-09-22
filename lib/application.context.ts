import { applicationInfo } from './application.info';
import { applicationConfig } from './application.config';

import { PasswordService } from './domain/password/password.service';

import { FileService } from './domain/password-safe/file.service';
import { PasswordSafeService } from './domain/password-safe/password-safe.service';
import { SerializationService } from './domain/password-safe/serialization.service';
import { EncryptionService } from './domain/password-safe/encryption.service';
import { PasswordSafeFileProcessor } from './domain/password-safe/password-safe-file.processor';

import { ValidationService } from './editor/support/validation.service';
import { ClipboardService } from './editor/support/clipboard.service';
import { Color } from './editor/support/color';
import { Logger } from './editor/support/logger';
import { PromptService } from './editor/support/prompt.service';

import { Shell } from './editor/shell/shell';
import { ChangeMasterPasswordCommand } from './editor/shell/command/change-master-password.command';
import { GenerateCommand } from './editor/shell/command/generate.command';
import { SetCommand } from './editor/shell/command/set.command';
import { GetCommand } from './editor/shell/command/get.command';
import { CopyCommand } from './editor/shell/command/copy.command';
import { MoveCommand } from './editor/shell/command/move.command';
import { DeleteCommand } from './editor/shell/command/delete.command';
import { ListCommand } from './editor/shell/command/list.command';
import { TreeCommand } from './editor/shell/command/tree.command';
import { EchoCommand } from './editor/shell/command/echo.command';

import { Cli } from './editor/cli/cli';
import { CreateCommand } from './editor/cli/command/create.command';
import { OpenCommand } from './editor/cli/command/open.command';
import { OpenOrCreateCommand } from './editor/cli/command/open-or-create.command';
import { ExportCommand } from './editor/shell/command/export.command';
import { HistoryCommand } from './editor/shell/command/history.command';

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
