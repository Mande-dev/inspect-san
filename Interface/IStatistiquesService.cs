using inspect_san.Models.DTOs;

namespace inspect_san.Interface;

public interface IStatistiquesService
{
    Task<StatistiquesDto> GetAsync(StatistiquesFilterDto filter);
    Task<string> ExportCsvAsync(StatistiquesFilterDto filter);
}
