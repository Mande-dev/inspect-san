using FluentAssertions;
using inspect_san.Services;

namespace inspect_san.Tests;

/// <summary>
/// Remplace les anciens tests de l'espace login Chef (supprimé).
/// La table métier ChefEtablissement reste ; le rôle de connexion n'existe plus.
/// </summary>
public class ChefEspaceObsoleteTests
{
    [Fact]
    public void EspaceChef_PlusAccessible_PourAucunRole()
    {
        AccessControl.CanAccess("Chef d'établissement", "espace-chef").Should().BeFalse();
        AccessControl.CanAccess("Contrôleur", "espace-chef").Should().BeFalse();
        AccessControl.CanAccess("Directeur Provincial", "espace-chef").Should().BeFalse();
        AccessControl.CanAccess("Administrateur système", "espace-chef").Should().BeFalse();
        AccessControl.RoleAccess.ContainsKey("Chef d'établissement").Should().BeFalse();
        AccessControl.RoleAccess.ContainsKey("Agent du Secrétariat").Should().BeFalse();
    }

    [Fact]
    public void DefaultLanding_TousVersHome()
    {
        AccessControl.DefaultLanding(DataScope.RoleChef).Should().Be(("Home", "Index"));
        AccessControl.DefaultLanding(DataScope.RoleAdmin).Should().Be(("Home", "Index"));
        AccessControl.DefaultLanding(DataScope.RoleControleur).Should().Be(("Home", "Index"));
    }

    [Fact]
    public void RoleChef_Resolve_PerimetreVide()
    {
        var scope = DataScope.Resolve(DataScope.RoleChef, "usr-006", "eco-001");
        scope.IsEmpty.Should().BeTrue();
        scope.Unrestricted.Should().BeFalse();
    }
}
