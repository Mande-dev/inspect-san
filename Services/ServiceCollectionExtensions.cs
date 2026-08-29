using inspect_san.Interface;
using inspect_san.Services.Mock;

namespace inspect_san.Services;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddHomeServices(this IServiceCollection services)
    {
        services.AddScoped<MockUserStore>();
        services.AddScoped<ICurrentUserScope, CurrentUserScope>();
        services.AddScoped<IAppEmailSender, AppEmailSender>();
        services.AddScoped<IDomainEmailNotifier, DomainEmailNotifier>();
        services.AddScoped<IFileStorageService, FileStorageService>();

        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IEcolesService, EcolesService>();
        services.AddScoped<IChefsService, ChefsService>();
        services.AddScoped<IAgentsService, AgentsService>();
        services.AddScoped<IUtilisateursService, UtilisateursService>();
        services.AddScoped<IMissionAccessService, MissionAccessService>();
        services.AddScoped<IMissionsService, MissionsService>();
        services.AddScoped<IFichesControleService, FichesControleService>();
        services.AddScoped<IDecisionsService, DecisionsService>();
        services.AddScoped<IStatistiquesService, StatistiquesService>();
        services.AddScoped<IParametresService, ParametresService>();
        services.AddScoped<IJournalService, JournalService>();
        services.AddScoped<INotificationsService, NotificationsService>();
        return services;
    }
}
