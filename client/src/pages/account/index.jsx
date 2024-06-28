import { Navigate, Outlet } from "react-router-dom";
import { useContext, useState } from "react";
import { useAuth } from "../../provider/auth.provider";
import { UserContext } from "../../provider/user.provider";
import Header from "../../components/Navigation";
import "./style.css";

export default function AccountDashboard() {
    const { token } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const { user } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("Le nouveau mot de passe et la confirmation du mot de passe ne correspondent pas");
            return;
        }

        try {
            const response = await fetch(`v1/api/users/${token.userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    firstname: firstName,
                    lastname: lastName,
                    email,
                    phone_number: phoneNumber,
                    old_password: currentPassword,
                    new_password: newPassword,
                }),
            });

            if (!response.ok) {
                throw new Error('Échec de la mise à jour');
            }

            alert("Profile updated successfully");
        } catch (error) {
            alert("Échec de la mise à jour");
            console.error("Error updating profile:", error);
        }
    };

    if (!token) {
        return <Navigate to="/login" />;
    }

    return (
        <>
            <Header />
            <div className="account-dashboard">
                <h2>Mise à jour du compte de<br></br> {user.firstname} {user.lastname}</h2>
                <form onSubmit={handleSubmit} className="form-container">
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            defaultValue={user && user.email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group-row">
                        <div className="form-group">
                            <label>Prénom</label>
                            <input
                                type="text"
                                defaultValue={user && user.firstname}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Nom de famille</label>
                            <input
                                type="text"
                                defaultValue={user && user.lastname}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>N° de téléphone</label>
                        <input
                            type="tel"
                            defaultValue={user && user.phone_number}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Mot de passe actuel</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group-row">
                        <div className="form-group">
                            <label>Nouveau mot de passe</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirmer le mot de passe</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit">Mise à jour du compte</button>
                </form>
            </div>
            <Outlet />
        </>
    );
}
