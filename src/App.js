import {useState} from "react";

const initialFriends = [
    {
        id: 118836,
        name: "Clark",
        image: "https://i.pravatar.cc/48?u=118836",
        balance: -7,
    },
    {
        id: 933372,
        name: "Sarah",
        image: "https://i.pravatar.cc/48?u=933372",
        balance: 20,
    },
    {
        id: 499476,
        name: "Anthony",
        image: "https://i.pravatar.cc/48?u=499476",
        balance: 0,
    },
];

function App() {
    const [showAddFriend, setShowAddFriend] = useState(false);
    const [friends, setFriends] = useState(initialFriends);
    const [selectedFriend, setSelectedFriend] = useState(null);

    function handleShowAddFriend() {
        setShowAddFriend((show) => !show);
    }

    function handleAddFriend(friend) {
        setFriends((friends) => [...friends, friend]);
        setShowAddFriend(false);
    }

    function handleSelectFriend(friend) {
        setSelectedFriend((currentSelected) => currentSelected?.id === friend.id ? null : friend);
        setShowAddFriend(false)
    }

    function handleSplitBill(value) {
        console.log(value);
        setFriends((friends) => friends.map((friend) =>
            friend.id === selectedFriend.id ?
                {...friend, balance: friend.balance + value}
                : friend
        ));

        //close form
        setSelectedFriend(null);
    }

    return (<div className='app'>
            <div className='sidebar'>
                <FriendList
                    friends={friends}
                    selectedFriend={selectedFriend}
                    onSelection={handleSelectFriend}
                />
                {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend}/>}
                <Button
                    onClick={handleShowAddFriend}>{showAddFriend ? 'close' : 'Add Friend'}
                </Button>
            </div>
            {selectedFriend && (
                <FormSplitBill
                    onSplitBill={handleSplitBill}
                    selectedFriend={selectedFriend}
                    key={selectedFriend.id}
                />)}
        </div>
    );
}


function FriendList({friends, onSelection, selectedFriend}) {
    return (
        <ul>
            {friends.map((friend) => (
                <Friend friend={friend} key={friend.id} selectedFriend={selectedFriend} onSelection={onSelection}/>))}
        </ul>
    )

}


function Friend({friend, onSelection, selectedFriend}) {

    const isSelected = selectedFriend?.id === friend.id;

    return (
        <li className={isSelected ? 'selected' : ''}>
            <img src={friend.image} alt={friend.name}/>
            <h3>{friend.name}</h3>
            {friend.balance < 0 && <p className={'red'}>You owe {friend.name} {Math.abs(friend.balance)}€</p>}
            {friend.balance > 0 && <p className={'green'}>Your friend {friend.name} owes you {friend.balance}€</p>}
            {friend.balance === 0 && <p>You and {friend.name} are even!</p>}
            <Button onClick={() => onSelection(friend)}>
                {isSelected ? 'Close' : 'Select'}
            </Button>
        </li>
    )
}


function Button({children, onClick}) {
    return (
        <button className={"button"} onClick={onClick}>{children}</button>
    );
}

function FormAddFriend({onAddFriend}) {

    const [name, setName] = useState('');
    const [image, setImage] = useState('https://i.pravatar.cc/48');

    function handleSubmit(e) {
        e.preventDefault();
        if (!name || !image) return;
        console.log('submit');

        const id = crypto.randomUUID();

        const newFriend = {
            name,
            image: `${image}?u=${id}`,
            balance: 0,
            id
        };

        onAddFriend(newFriend);
        setName('');
        setImage('https://i.pravatar.cc/48');
    }


    return (<form className={"form-add-friend"} onSubmit={handleSubmit}>
        <label>👩🏼‍🤝‍🧑🏾Friend</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>

        <label>🎴 Image URL</label>
        <input type="text" value={image} onChange={(e) => setImage(e.target.value)}/>

        <Button onClick={() => onAddFriend}>Add</Button>
    </form>);
}

function FormSplitBill({selectedFriend, onSplitBill}) {
    const [billValue, setBillValue] = useState('');
    const [paidByUser, setPaidByUser] = useState('');
    const [whoIsPaying, setwhoIsPaying] = useState('user');

    const friendExpense = billValue ? billValue - paidByUser : '';

    function handleSubmit(e) {
        e.preventDefault();
        if (!billValue || !paidByUser) return;
        console.log('submit');
        onSplitBill(whoIsPaying === 'user' ? friendExpense : -paidByUser);
    }

    return (
        <form className={"form-split-bill"} onSubmit={handleSubmit}>
            <h2>Split a bill with {selectedFriend.name}</h2>
            <label>💰Bill Value</label>
            <input type="text" value={billValue} onChange={(e) => setBillValue(Number(e.target.value))}/>
            <label>👨🏽Your expenses</label>
            <input type="text" value={paidByUser}
                   onChange={(e) => setPaidByUser(Number(e.target.value) > billValue ? paidByUser : Number(e.target.value))}/>
            <label>👩🏼‍🤝‍🧑🏾{selectedFriend.name}'s expense</label>
            <input type="text" disabled={true} value={friendExpense}/>
            <label>😐 Who is paying the bill</label>
            <select value={whoIsPaying} onChange={(e) => setwhoIsPaying(e.target.value)}>
                <option value={'user'}>You</option>
                <option value={'friend'}>{selectedFriend.name}</option>
            </select>
            <Button>Split bill</Button>
        </form>)
}

export default App;
