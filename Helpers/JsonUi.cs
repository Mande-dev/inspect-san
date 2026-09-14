using System.Text.Json;
using System.Text.Json.Serialization;

namespace inspect_san.Helpers;

/// <summary>
/// Sérialisation JSON pour attributs data-* des vues.
/// IgnoreCycles évite Ecole↔Regime, Mission↔Participations, etc.
/// </summary>
public static class JsonUi
{
    public static readonly JsonSerializerOptions Options = new()
    {
        ReferenceHandler = ReferenceHandler.IgnoreCycles,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    /// <summary>Sérialise un objet pour attributs data-* des vues.</summary>
    public static string Serialize(object? value)
        => JsonSerializer.Serialize(value, Options);
}
