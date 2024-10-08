package repositorio;

import model.Cena;
import model.GameState;

import java.sql.*;

public class CenaRepo {
    public static Cena findCenaById(int id) throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/textadventure", "root", "1234");
            stmt = conn.prepareStatement("SELECT * FROM cenas WHERE id_cena = ?");
            stmt.setInt(1, id);
            rs = stmt.executeQuery();

            if (rs.next()) {
                Integer id_cena = rs.getInt("id_cena");
                String descricao = rs.getString("descricao");
                String local = rs.getString("id_local");
                String nome = rs.getString("nome");
                return new Cena(id_cena, descricao, local, nome);
            } else {
                throw new SQLException("Cena com ID " + id + " não encontrada.");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw e;
        } finally {
            if (rs != null) rs.close();
            if (stmt != null) stmt.close();
            if (conn != null) conn.close();
        }
    }
}
