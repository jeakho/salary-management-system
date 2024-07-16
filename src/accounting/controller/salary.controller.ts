import { Controller, Get, Param, ParseIntPipe, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { SalaryService } from '../service/salary.service';
import { DateQueryDto } from 'src/common/model/date-query.dto';

@Controller('salary')
export class SalaryController {
    constructor(private readonly salaryService: SalaryService) {}

    @Get()
    computeStaffSalary(@Query() dateAtDto: DateQueryDto): Promise<{ salary: number }> {
        this.salaryService.clear();
        return this.salaryService.computeStaffSalaryAtDate(dateAtDto.date);
    }

    @Get(':id')
    computeStaffMemberSalary(
        @Param('id', ParseIntPipe) staffMemberId: number,
        @Query() dateAtDto: DateQueryDto
    ): Promise<{ salary: number }> {
        this.salaryService.clear();
        return this.salaryService.computeStaffMemberSalaryAtDate(staffMemberId, dateAtDto.date);
    }
}
