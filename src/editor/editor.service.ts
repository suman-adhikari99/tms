import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectManagement } from 'src/projects/project-management.repository';
import { TaskRepository } from 'src/task/task.repository';
import { User } from 'src/users/user.entity';
import { UserRepository } from 'src/users/user.repository';
import { getObjectId, getString } from 'src/utilities';

@Injectable()
export class EditorService {
  constructor(
    private projectRepository: ProjectManagement,
    private userRepository: UserRepository,
    private taskRepository: TaskRepository,
  ) {}

  async getMyTasks(user: User) {
    try {
      if (!user.role.mainRoles.includes('ED'))
        throw new ForbiddenException('You are not Payroll Manager');
      const editor = await this.userRepository.find({
        where: { 'role.mainRoles': { $in: ['ED'] } },
      });

      const editorsId = editor.map((ed) => ed.id);

      const editorId = editorsId.map((id) => id.toString());

      const tasks = await this.taskRepository.find({
        where: {
          'teamMember.userId': { $in: editorId },
        },
      });
      console.log('tasks', tasks);
      return tasks;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async getRecentProjects(currentUser: User) {
    if (
      !(
        currentUser.role.mainRoles.includes('ED') ||
        currentUser.role.mainRoles.includes('CM')
      )
    )
      throw new ForbiddenException('Only editor can access this route');

    const pipeline = [
      {
        $match: {
          teamMember: {
            $elemMatch: {
              userId: getString(currentUser.id),
              isJoined: true,
            },
          },
        },
      },
      {
        $group: {
          _id: '$projectId',
        },
      },
      {
        $lookup: {
          from: 'projects',
          let: {
            projectObjectId: {
              $toObjectId: '$_id',
            },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$projectObjectId'],
                },
              },
            },
          ],
          as: 'project',
        },
      },
      {
        $unwind: {
          path: '$project',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $replaceRoot: {
          newRoot: '$project',
        },
      },
      {
        $sort: {
          createdDate: -1,
        },
      },
    ];

    return this.taskRepository.aggregate(pipeline).toArray();
  }
}
