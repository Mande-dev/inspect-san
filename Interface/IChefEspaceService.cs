using inspect_san.ViewModels;

namespace inspect_san.Interface;

public interface IChefEspaceService
{
    Task<ChefEspaceViewModel> GetEspaceAsync(string? ecoleId, bool canValiderFiche, CancellationToken ct = default);
}
