import { BoardsService } from './boards.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Board } from './entities/board.entity';
import { CreateBoardInput } from './dto/create-board.input';

@Resolver()
export class BoardsResolver {
  constructor(private readonly boardsService: BoardsService) {}

  @Query(() => [Board])
  fetchBoards(): Board[] {
    return this.boardsService.findAll();
  }

  @Mutation(() => String)
  createBoard(
    // @Args('writer') writer: string,
    // @Args('title') title: string,
    // @Args('contents') contents: string,
    @Args('input') createBoardInput: CreateBoardInput,
  ): string {
    return this.boardsService.create(createBoardInput);
  }
}
