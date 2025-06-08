
import { tokenService } from './tokenService';
import { courseService } from './courseService';
import { courseworkService } from './courseworkService';
import { submissionService } from './submissionService';
import { syncService } from './syncService';

export const googleClassroomService = {
  ...tokenService,
  ...courseService,
  ...courseworkService,
  ...submissionService,
  ...syncService,
};

export * from './types';
