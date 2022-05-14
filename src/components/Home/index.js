import React, { Component } from 'react';
import {
  AuthUserContext,
  withAuthorization,
} from '../Session';
import { withFirebase } from '../Firebase';
import {
  Container,
  Header,
  Dimmer,
  Loader,
  Image,
  Segment,
  Icon,
  Form,
  Dropdown,
  TextArea,
  Button,
} from 'semantic-ui-react'

const paraFormatOptions = [
  {
    key: 'red',
    text: 'red',
    value: 'red',
  },
  {
    key: 'thick',
    text: 'bold',
    value: 'thick',
  },
]


const HomePage = () => (
  <div>
    <Container>
      <Header as='h1'>My paragraphs</Header>
      <Messages />
    </Container>
  </div>
);

class MessagesBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      type: [],
      loading: false,
      messages: [],
    };
  }

  onChangeText = event => {
    this.setState({ text: event.target.value });
  };

  onChangeType = (event, { value }) => {
    this.setState({ type: value.join(' ') });
  };

  onCreateMessage = (event, authUser) => {
    this.props.firebase.messages().push({
      text: this.state.text,
      type: this.state.type,
      userId: authUser.uid,
      createdAt: this.props.firebase.serverValue.TIMESTAMP,
    });

    this.setState({ text: '', type: [] });

    event.preventDefault();
  };

  onRemoveMessage = uid => {
    this.props.firebase.message(uid).remove();
  };

  onEditMessage = (message, text, type) => {
    const { uid, ...messageSnapshot } = message;

    this.props.firebase.message(message.uid).set({
      ...messageSnapshot,
      text,
      type,
      editedAt: this.props.firebase.serverValue.TIMESTAMP,
    });
  };

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.messages().on('value', snapshot => {

      const messageObject = snapshot.val();
      if (messageObject) {

        const messageList = Object.keys(messageObject).map(key => ({
          ...messageObject[key],
          uid: key,
        }));
        this.setState({
          messages: messageList,
          loading: false,
        });
      } else {
        this.setState({ messages: null, loading: false });
      }
    });
  }
  componentWillUnmount() {
    this.props.firebase.messages().off();
  }
  render() {
    const { text, type, messages, loading } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            {loading &&

              <Segment>
                <Dimmer active inverted>
                  <Loader inverted>Loading</Loader>
                </Dimmer>

                <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
              </Segment>
            }

            {messages ? (
              <MessageList
                authUser={authUser}
                messages={messages}
                onEditMessage={this.onEditMessage}
                onRemoveMessage={this.onRemoveMessage}
              />
            ) : (
              <Segment placeholder>
                <Header icon>
                  <Icon name='edit' />
                  My paragraphs page is empty.<br /> You can start adding paragraphs in the form below.
                </Header>
              </Segment>
            )}

            <Form onSubmit={event => this.onCreateMessage(event, authUser)}>
              <Form.Field>
                <label>Paragraph text:</label>
                <TextArea
                  value={text}
                  onChange={this.onChangeText}
                  placeholder='Your text here'
                  style={{ minHeight: 100 }}
                />
              </Form.Field>
              <Form.Field>
                <label>Paragraph formating type:</label>
                <Dropdown
                  search
                  multiple
                  selection
                  // value={type}
                  onChange={this.onChangeType}
                  placeholder='Your text here'
                  options={paraFormatOptions}
                />
              </Form.Field>
              <Button type="submit">Send</Button>
            </Form>

          </div>
        )}
      </AuthUserContext.Consumer>
    );

  }
}

const MessageList = ({ authUser, messages, onRemoveMessage, onEditMessage }) => (
  <ul>
    {messages.map(message => (
      <MessageItem
        authUser={authUser}
        key={message.uid}
        message={message}
        onRemoveMessage={onRemoveMessage}
        onEditMessage={onEditMessage}
      />
    ))}
  </ul>
);

class MessageItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      editText: this.props.message.text,
      editType: this.props.message.type,
    };
  }

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.message.text,
      editType: this.props.message.type,
    }));
  };

  onChangeEditText = event => {
    this.setState({ editText: event.target.value });
  };

  onChangeEditType = event => {
    this.setState({ editType: event.target.value });
  };

  onSaveEdit = () => {
    this.props.onEditMessage(this.props.message, this.state.editText, this.state.editType);
    this.setState({ editMode: false });
  };

  render() {
    const { authUser, message, onRemoveMessage } = this.props;
    const { editMode, editText, editType } = this.state;

    return (
      <li>
        {editMode ? (
          <>
            <input
              type="text"
              value={editText}
              onChange={this.onChangeEditText}
            />
            <input
              type="type"
              value={editType}
              onChange={this.onChangeEditType}
            />
          </>
        ) : (
          <span>
            <strong>{message.userId}</strong> {message.text}, {message.type}
            {message.editedAt && <span>(Edited)</span>}
          </span>
        )}

        {authUser.uid === message.userId && (
          <span>
            {editMode ? (
              <span>
                <button onClick={this.onSaveEdit}>Save</button>
                <button onClick={this.onToggleEditMode}>Reset</button>
              </span>
            ) : (
              <button onClick={this.onToggleEditMode}>Edit</button>

            )}

            {!editMode && (
              <button
                type="button"
                onClick={() => onRemoveMessage(message.uid)}
              >
                Delete
              </button>
            )}
          </span>
        )}

      </li>
    );
  }
}
// const MessageItem = ({ message, onRemoveMessage }) => (
//     <li>
//         <strong>{message.userId}</strong>

//         {message.text}

//         <button
//             type="button"
//             onClick={() => onRemoveMessage(message.uid)}
//         >
//             Delete
//         </button>
//     </li>
// );

const condition = authUser => !!authUser;

const Messages = withFirebase(MessagesBase);

export default withAuthorization(condition)(HomePage);